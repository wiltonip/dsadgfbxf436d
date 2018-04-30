package com.threering.api.dom;

import lombok.Data;

import java.util.List;

@Data
public class ModelsResponse {
    private String result;
    private List<ModelOverview> models;
}
